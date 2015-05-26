var literatureModule = angular.module('LiteratureModule', ['tagModule']);

literatureModule.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);


literatureModule.factory('LiteratureService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/literatures/:literatureId', {literatureId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.factory('VideoService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/videos/:videoId', {videoId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.factory('PptService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/ppts/:pptId', {pptId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.controller('LiteratureListCtrl', ['$scope', '$rootScope', '$modal', '$http', 'uiGridConstants', 'LiteratureService', function ($scope, $rootScope, $modal, $http, uiGridConstants, LiteratureService) {
    LiteratureService.query(function (data) {
        $scope.literatureList = data;
    });

    $scope.gridOptions = {
        data: 'literatureList',
        enableFiltering: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        enableColumnResizing: true,
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        columnDefs: [{
            field: "title",
            displayName: "标题",
            width: 300,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="viewLiterature({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "author",
            displayName: "作者"
        }, {
            field: "published_year",
            displayName: "年份"
        }, {
            field: "publisher",
            displayName: "期刊(会议)"
        }, {
            field: "rank_str",
            displayName: "评分/人数"
        }]
    };

    $scope.toggleFiltering = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.openQuery = function () {
        var queryModalInstance = $modal.open({
            templateUrl: 'partial/literatureQuery.html',
            controller: 'LiteratureQueryCtrl'
        });

        queryModalInstance.result.then(function (query) {
            console.log(query);
            $http.post('http://121.40.106.155:5000/api/v1/literatures/fuzzysearch', query).
                success(function (data) {
                    $scope.literatureList = data;
                });
        }, function () {

        });
    };
}]);

literatureModule.controller('LiteratureQueryCtrl', ['$scope', '$modalInstance', 'tagService', function ($scope, $modalInstance, tagService) {
    $scope.literature = {};
    $scope.tags = [];

    tagService.query(function (data) {
        $scope.allTags = data;
    });

    $scope.judgeSelected = function (item) {
        if (item.selected)
            return true;
        else
            return false;
    }

    $scope.submit = function () {
        for (var i = 0; i < $scope.allTags.length; i++) {
            if ($scope.allTags[i].selected)
                $scope.tags.push($scope.allTags[i]);
        }
        $scope.literature.tags = $scope.tags;
        $modalInstance.close($scope.literature);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);

literatureModule.controller('LiteratureAddCtrl', ['$scope', '$rootScope', '$state', '$http', 'LiteratureService', 'tagService', 'Time', function ($scope, $rootScope, $state, $http, LiteratureService, tagService, Time) {
    $scope.literatureTypeList = [];

    //check contain
    Array.prototype.contains = function (element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == element) {
                return true;
            }
        }
        return false;
    }

    $scope.tagsDivided = [];

    //获取分组的tag
    $http.get("http://121.40.106.155:5000/api/v1/tags")
        .success(function (data) {
            $scope.allTags = data;
            $scope.tagTypes = [];
            $scope.allTags.forEach(function (tag) {
                if ($scope.tagsDivided[tag.type] == null) {
                    $scope.tagsDivided[tag.type] = new Array();
                    $scope.tagsDivided[tag.type].push(tag);
                }
                else {
                    $scope.tagsDivided[tag.type].push(tag);
                }


                if ($scope.tagTypes.contains(tag.type))
                    ;
                else
                    $scope.tagTypes.push(tag.type);
            })

        });

    $scope.freshViews = function () {
        $scope.fieldsToBeShowed = $scope.configData[$scope.selectedType.name]
    }

    //read settings
    $http.get('http://121.40.106.155:5000/api/v1/settings')
        .success(function (data) {
            $scope.configData = data;
        });

    $http.post('http://121.40.106.155:5000/api/v1/types/query', {name: "", type_id: 1}).
        success(function (data) {
            $scope.literatureTypeList = data;
            $scope.selectedType = $scope.literatureTypeList[0];
            $scope.fieldsToBeShowed = $scope.configData[$scope.selectedType.name];

        });

    tagService.query(function (data) {
        $scope.allTags = data;
        console.log($scope.allTags);
    });


    $scope.isEdit = true;

    $scope.literature = {};

    $scope.save = function () {
        console.log($scope.tagsDivided)
        LiteratureService.save($scope.literature, function (data) {

            for (var i = 0; i < $scope.allTags.length; i++) {
                if ($scope.allTags[i]['selected'])
                    $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                        "tag_id": $scope.allTags[i]['id'],
                        "resource_id": data.id,
                        "type": 1
                    })
            }

            $scope.tagsDivided.forEach(function (tagGroup) {
                tagGroup.forEach(function (element) {
                    if (element.selected)
                        $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                            "tag_id": element.id,
                            "resource_id": data.id,
                            "type": 1
                        })
                })
            })
            //for (var i = 0; i < $scope.allTags.length; i++) {
            //    if ($scope.allTags[i]['selected'])
            //        $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
            //            "tag_id": $scope.allTags[i]['id'],
            //            "resource_id": data.id,
            //            "type": 1
            //        })
            //}
            $state.go('viewLiterature', {id: data.id});
        });
    };

    $scope.submit = function () {
        $scope.literature.creator_id = $rootScope.userId;
        $scope.literature.create_time = Time.currentTime(new Date());
        $scope.literature.literature_type_id = $scope.selectedType.id;

        if ($scope.literature.literature_type_id == 1 && !$scope.literature.published_year) {
            KB_Conference($scope.literature.publisher_abbreviation);
        } else if ($scope.literature.literature_type_id == 1 && $scope.literature.published_year) {
            KB_Conference_Year($scope.literature.publisher_abbreviation, $scope.literature.published_year);
        } else if ($scope.literature.published_year && $scope.literature.issue && $scope.literature.literature_type_id == 0) {
            KB_Journal_Year_Issue($scope.literature.publisher_abbreviation, $scope.literature.published_year, $scope.literature.issue);
        } else if ($scope.literature.literature_type_id == 0) {
            KB_Journal($scope.literature.publisher_abbreviation);
        } else {
            $scope.save();
        }

    };

    function KB_Conference(abbreviation) {
        var query = {};
        query.abbreviation = abbreviation;
        $http.post('http://121.40.106.155:5000/api/v1/kb_conference/query', query).success(function (data) {
            $scope.literature.publisher = data.full;
            $scope.save();
        }).error(function (data) {
            $scope.save();
        });
    };

    function KB_Conference_Year(abbreviation, year) {
        var query = {};
        query.abbreviation = abbreviation;
        query.year = year;
        $http.post('http://121.40.106.155:5000/api/v1/kb_conference_year/query', query).success(function (data) {
            $scope.literature.location = data.location;
            $scope.literature.editor = data.editor;
            $scope.save();
        }).error(function (data) {
            $scope.save();
        });
    };

    function KB_Journal(abbreviation) {
        var query = {};
        query.abbreviation = abbreviation;
        $http.post('http://121.40.106.155:5000/api/v1/kb_journal/query', query).success(function (data) {
            $scope.literature.publisher = data.full;
            $scope.save();
        }).error(function (data) {
            $scope.save();
        });
    };

    function KB_Journal_Year_Issue(abbreviation, year, issue) {
        var query = {};
        query.abbreviation = abbreviation;
        query.year = year;
        query.issue = issue;
        $http.post('http://121.40.106.155:5000/api/v1/kb_journal_year_issue/query', query).success(function (data) {
            $scope.literature.editor = data.editor;
            $scope.save();
        }).error(function (data) {
            $scope.save();
        });
    };

}]);

literatureModule.controller('LiteratureShowCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'LiteratureService', 'Time', function ($scope, $rootScope, $state, $stateParams, $http, LiteratureService, Time) {
    $scope.literatureTypeList = [];
    $scope.comment_type_id = 1;

    $scope.isEdit = false;
    $scope.currentType = 1;
    $scope.currentId = $stateParams.id;


    var id = $stateParams.id;

    $scope.freshViews = function () {
        $scope.fieldsToBeShowed = $scope.configData[$scope.selectedType.name]
    }


    Array.prototype.contains = function (element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == element) {
                return true;
            }
        }
        return false;
    }


    //read settings
    $http.get('http://121.40.106.155:5000/api/v1/settings')
        .success(function (data) {
            $scope.configData = data;
        });


    LiteratureService.get({literatureId: id}, function (data) {
        $scope.literature = data;

        $http.post('http://121.40.106.155:5000/api/v1/types/query', {name: "", type_id: $scope.currentType}).
            success(function (data) {
                $scope.literatureTypeList = data;

                for (var i = 0; i < $scope.literatureTypeList.length; i++) {
                    if ($scope.literatureTypeList[i].id == $scope.literature.literature_type_id) {
                        $scope.selectedType = $scope.literatureTypeList[i];
                        $scope.fieldsToBeShowed = $scope.configData[$scope.selectedType.name];
                        break;
                    }
                }
            });

        $http.post("http://121.40.106.155:5000/api/v1/tag_resources/query", {
            "resource_id": data.id,
            "type": $scope.currentType
        })
            .success(function (data) {
                $scope.tag_res = data;
                $scope.tagIds = [];
                data.forEach(function (single_tag_res) {
                    $scope.tagIds.push(single_tag_res.tag_id)
                });

                $http.get("http://121.40.106.155:5000/api/v1/tags")
                    .success(function (data) {
                        $scope.allTags = data;
                        $http.post("http://121.40.106.155:5000/api/v1/tags/batch", {"ids": $scope.tagIds})
                            .success(function (data) {
                                $scope.tags = data;

                                $scope.allTags.forEach(function (element) {
                                    $scope.tags.forEach(function (inner_element) {
                                        if (element.id == inner_element.id)
                                            element.selected = true;
                                    });
                                });

                                $scope.tagsDividedShown = [];
                                $scope.tagsDivided = [];
                                $scope.tagTypes = [];
                                $scope.tagTypesShown = [];

                                $scope.allTags.forEach(function (element) {
                                    if (element.selected) {
                                        if ($scope.tagsDividedShown[element.type] == null) {
                                            $scope.tagsDividedShown[element.type] = [];
                                            $scope.tagsDividedShown[element.type].push(element);
                                        }
                                        else
                                            $scope.tagsDividedShown[element.type].push(element);

                                        if ($scope.tagTypesShown.contains(element.type))
                                            ;
                                        else
                                            $scope.tagTypesShown.push(element.type);
                                    }


                                    if ($scope.tagsDivided[element.type] == null) {
                                        $scope.tagsDivided[element.type] = [];
                                        $scope.tagsDivided[element.type].push(element);
                                    }
                                    else
                                        $scope.tagsDivided[element.type].push(element);

                                    if ($scope.tagTypes.contains(element.type))
                                        ;
                                    else
                                        $scope.tagTypes.push(element.type);

                                });

                                console.log($scope.tagsDividedShown);
                            });
                    });

            });
    });

    $scope.delete = function () {
        $scope.literature.$delete(function () {
            $state.go('showAllLiterature');
        });
    };

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if ($scope.isEdit) {
            $scope.origin = angular.copy($scope.literature);
        }

        if (!$scope.isEdit) {
            $scope.literature = $scope.origin;
        }
    };

    $scope.getEditLabel = function () {
        if ($scope.isEdit) {
            return "取消";
        } else {
            return "编辑/上传";
        }
    };

    $scope.submit = function () {
        $scope.literature.updater_id = $rootScope.userId;
        $scope.literature.update_time = Time.currentTime(new Date());
        $scope.literature.literature_type_id = $scope.selectedType.id;

        $scope.literature.$update(function () {
            console.log($scope.literature);
            $scope.isEdit = !$scope.isEdit;
        });

        //$scope.allTags = [];

        //$scope.tagsDivided.forEach(function (tagGroup) {
        //    tagGroup.foreach(function (tag) {
        //        $scope.allTags.push(tag);
        //    })
        //})

        for (var i = 0; i < $scope.allTags.length; i++) {
            var not_found_in_tags_existed = true;
            $scope.tags.forEach(function (tag_existed) {
                if ($scope.allTags[i]['id'] == tag_existed['id'])
                    not_found_in_tags_existed = false;
            });

            if (not_found_in_tags_existed && $scope.allTags[i]['selected']) {
                $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                    "tag_id": $scope.allTags[i]['id'],
                    "resource_id": $scope.literature.id,
                    "type": $scope.currentType
                });
                $scope.tags.push($scope.allTags[i]);
                if ($scope.tagsDividedShown[$scope.allTags[i].type]) {
                    $scope.tagsDividedShown[$scope.allTags[i].type].push($scope.allTags[i]);
                    $scope.tagTypesShown.push($scope.allTags[i].type);
                }
                else {
                    $scope.tagsDividedShown[$scope.allTags[i].type] = [];
                    $scope.tagsDividedShown[$scope.allTags[i].type].push($scope.allTags[i]);
                    $scope.tagTypesShown.push($scope.allTags[i].type);
                }
            }
            else if (!not_found_in_tags_existed && !$scope.allTags[i]['selected']) {
                $scope.tag_res.forEach(function (element) {
                    if (element.tag_id == $scope.allTags[i]['id'] && element.type == $scope.currentType) {
                        $http.delete('http://121.40.106.155:5000/api/v1/tag_resources/'.concat(element.id))
                        for (var j = 0; j < $scope.tags.length; j++)
                            if ($scope.tags[j]['id'] == element['tag_id']) {
                                console.log("delete tag")
                                console.log($scope.tags[j]['name']);
                                $scope.tags.splice(j, 1);
                                break;

                                $http.delete('http://121.40.106.155:5000/api/v1/tag_resources/'.concat(element.id))
                                $scope.tagsDividedShown[$scope.allTags[i].type].forEach(function (tag) {
                                    if (tag.id == element.tag_id) {
                                        var m = $scope.tagsDividedShown[$scope.allTags[i].type].indexOf(tag);
                                        $scope.tagsDividedShown[$scope.allTags[i].type].splice(m, 1);
                                        if ($scope.tagsDividedShown[$scope.allTags[i].type].length == 0) {
                                            var n = $scope.tagTypesShown.indexOf($scope.allTags[i].type);
                                            $scope.tagTypesShown.splice(n, 1);
                                        }
                                    }

                                });

                            }
                    }
                    }
                    )
                }
            }

            $http.post("http://121.40.106.155:5000/api/v1/tag_resources/query", {
                "resource_id": $scope.literature.id,
                "type": $scope.currentType
            })
                .success(function (data) {
                    $scope.tag_res = data;
                });
        }
        ;

        $http.post("http://121.40.106.155:5000/api/v1/literatures/export", {'id': id})
            .success(function (data) {
                var content = data;
                var blob = new Blob([content], {type: 'text/plain'});
                $scope.exportUrl = (window.URL || window.webkitURL).createObjectURL(blob);
            })

    }
    ])
    ;
